import cheerio from 'cheerio';
import playwright from 'playwright';
import userAgent from 'user-agents';
import dotenv from 'dotenv';
import {
  replaceSpecialCharacters,
  toPascalCase,
  validateRegNr,
} from './utils/vehicle.js';
dotenv.config();

export const LoadHTMLFromPage = async (regnr) => {
  try {
    let html = '';

    await playwright.chromium
      .launch({ headless: true })
      .then(async (browser) => {
        const context = await browser.newContext({
          userAgent: userAgent.toString(),
        });

        const page = await context.newPage();

        await page.goto(process.env.SCRAPE_PAGE_FIRST_URL).catch((err) => {
          console.log(err);
        });

        await page.waitForTimeout(500).catch((err) => {
          console.log(err);
        });

        await page.fill('#ts-regnr-sok', regnr).catch((err) => {
          console.log(err);
        });

        await page
          .locator('#btnSok')
          .click()
          .catch((err) => {
            console.log(err);
          });

        await page.waitForURL(process.env.PAGE_TO_SCRAPE).catch((err) => {
          console.log(err);
        });

        await page
          .locator('#expand_button')
          .click()
          .catch((err) => {
            console.log(err);
          });

        html = await page.content();

        await browser.close();
      });

    return html;
  } catch (error) {
    throw `Error loading webpage ${error}`;
  }
};
export const CrawlHTMLV2 = (html) => {
  try {
    const $ = cheerio.load(html);
    let model = {};

    const mainDiv = $('#accordion');

    mainDiv.children().each((i, elem) => {
      // inside panel
      const curr = $(elem);

      const titleContent = curr.first();
      let headTitle = $(titleContent)
        .find('span > a')
        .text()
        .replace(/\s+|([.,])(?=\S)/g, '$1 ')
        .replace(/^\s|\s$/g, '');
      headTitle = toPascalCase(headTitle);

      model[headTitle] = {};

      const content = curr.last(); // get collapse div

      content.children().each((j, elm) => {
        // inside collapsediv
        const data = $(elm).find('div > div');

        data.children().each((k, elme) => {
          //inside content div
          var className = $(elme).attr('class');

          if (className && className.includes('col-sm-6 col-xs-12')) {
            var para = $(elme).find('p');

            let title = $(para.find('strong'))
              .text()
              .replace(/\s+|([.,])(?=\S)/g, '$1 ')
              .replace(/^\s|\s$/g, '');
            $(para.find('strong')).remove();
            $(para.find('br')).remove();

            const value = $(para)
              .text()
              .replace(/\s+|([.,])(?=\S)/g, '$1 ')
              .replace(/^\s|\s$/g, '');

            title = toPascalCase(replaceSpecialCharacters(title));
            model[headTitle][title] = value;
          }
        });
      });
    });

    return model;
  } catch (error) {
    throw 'Error crawling html';
  }
};

export const GetVehicleInformation = async (regnr) => {
  if (!regnr) return 'no registration number attached';
  if (!validateRegNr(regnr)) return 'not a valid registration number';

  const html = await LoadHTMLFromPage(regnr);

  return updateVehicleData(CrawlHTMLV2(html));
};

const updateVehicleData = (data) => {
  let newVehicleData = {};
  const technicalData =
    data.TekniskaDatakarossmttOchViktaxlarOchHjulKopplingsanordningOchBromsarPassageraremotorOchMilj;

  return (newVehicleData = {
    vehicleIdentity: {
      make: data.Fordonsidentitet.Fabrikat ?? null,
      tradeName: data.Fordonsidentitet.Handelsbeteckning ?? null,
      vehicleType: data.Fordonsidentitet.Fordonsslag ?? null,
      vehicleClass: data.Fordonsidentitet.Fordonsslagsklass ?? null,
      vehicleCategory: data.Fordonsidentitet.Fordonskategori ?? null,
      vehicleYear: data.Fordonsidentitet.Fordonsar ?? null,
    },
    TaxAndFees: {
      vehicleTaxable: data.SkattOchAvgifter.Fordonsskattepliktigt ?? null,
      annualTax: data.SkattOchAvgifter.Arsskatt ?? null,
      roadTrafficRegistryFee:
        data.SkattOchAvgifter.Vagtrafikregisteravgift ?? null,
    },
    technicalData: {
      body: technicalData.Kaross ?? null,
      length: technicalData.Langd ?? null,
      width: technicalData.Bredd ?? null,
      height: technicalData.Hojd ?? null,
      curbWeightActualWeight: technicalData.TjansteviktFaktiskVikt ?? null,
      maxPayload: technicalData.MaxLastvikt ?? null,
      grossVehicleWeight: technicalData.Totalvikt ?? null,
      originalGrossVehicleWeight: technicalData.UrsprungligTotalvikt ?? null,
      taxWeight: technicalData.Skattevikt ?? null,
      frontAxlesDriven: technicalData.DrivandeAxlarFram ?? null,
      rearAxlesDriven: technicalData.DrivandeAxlarBak ?? null,
      maxAxleDistanceAxle12: technicalData.MaxAxelavstandAxel12 ?? null,
      trackWidth: technicalData.Sparvidd ?? null,
      tireSize: technicalData.Dackdimension ?? null,
      rimDimension: technicalData.Falgdimension ?? null,
      maxLoadTrailerVehicleConnection:
        technicalData.StorstaBelastningKopplingFordon ?? null,
      maxTrailerWeightWithBrakes: technicalData.MaxSlapvagnsvikt ?? null,
      maxTrailerWeightWithoutBrakes: technicalData.MaxSlapviktObromsad ?? null,
      maxCombinedGrossVehicleWeightTrailerWeight:
        technicalData.MaxSammanlagdBruttoviktTagvikt ?? null,
      maxTotalWeightTrailerWhenDrivingLicenseB:
        technicalData.SlapetsMaximalaTotalviktVidKorkortsbehorighetB ?? null,
      maxTotalWeightTrailerWithoutExtendedDrivingLicenseB:
        technicalData.SlapetsMaximalaTotalviktVidUtokadKorkortsbehorighetB ??
        null,
      maxNumberOfPassengers: technicalData.AntalPassagerareMax ?? null,
      frontPassengerSeatAirbag:
        technicalData.KrockkuddeFramrePassagerarplats ?? null,
      gearbox: technicalData.Vaxellada ?? null,
      displacement: technicalData.Slagvolym ?? null,
      euroClassification: technicalData.Euroklassning ?? null,
      environmentalClassification: technicalData.Utslappsklass ?? null,
      emissionClassification: technicalData.Drivmedel ?? null,
      electricVehicle: technicalData?.Elfordon ?? null,
      enginePower: technicalData.Motoreffekt ?? null,
      powerStandard: technicalData.Effektnorm ?? null,
      maxSpeed: technicalData.MaxHastighet ?? null,
      noiseLevelIdle: technicalData.LjudnivaStillastaende ?? null,
      idleSpeed: technicalData.VarvtalStillastaende ?? null,
      noiseLevelDuringDriving: technicalData.LjudnivaVidKorning ?? null,
      exhaustEmissionDirectiveRegulations:
        technicalData.Avgasdirektivreglemente ?? null,
      ruralDriving: technicalData.Landsvagskorning ?? null,
      urbanDriving: technicalData.Stadskorning ?? null,
      combinedDriving: technicalData.BlandadKorning ?? null,
      carbonMonoxideCo: technicalData.KolmonoxidCo ?? null,
      totalHydrocarbonsThc: technicalData.KvaveoxiderNox ?? null,
      nonMethaneHydrocarbonsNmhc:
        technicalData.KolvatenOchKvaveoxiderThcNox ?? null,
      nitrogenOxidesNox: technicalData.MiljoinnovationKod ?? null,
      particles: technicalData.MinskningAvCo2TestcykelNedc ?? null,
    },
  });
};

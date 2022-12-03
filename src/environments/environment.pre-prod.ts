import { redcoto } from "./environment.utils";

export const environment = {
    production: false,
    preProduction: true,
    staging: false,
    apiUrl: `http://slnxdock01cd${redcoto}:5020/api/`,
    apiInterfaceUrl: `http://slnxdock01cd${redcoto}:5021/interfaces/`,
    serialApiUrl: "http://localhost:8080/serialapi/",
    apiIpad: "http://ipadwebservices/empleadosws/ServiceSvc.svc/",
    apiTrack: "http://apps27/TrackingApiCD/api/",
    version: `${require('../../package.json').version}`,
    apiUrlTicket: `http://slnxdesa01:5040/api/`,
};

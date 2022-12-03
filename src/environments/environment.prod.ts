import { redcoto } from "./environment.utils";

export const environment = {
    production: true,
    preProduction: false,
    staging: false,
    apiUrl: `http://slnxdock01cd${redcoto}:5020/api/`,
    apiInterfaceUrl: `http://slnxdock01cd${redcoto}:5021/interfaces/`,
    serialApiUrl: "http://localhost:8080/serialapi/",
    apiIpad: "http://ipadwebservices/empleadosws/ServiceSvc.svc/",
    apiTrack: "http://apps27/TrackingApiCD/api/",
    version: `${require('../../package.json').version}`,
    apiUrlTicket: `http://slnxdesa01:5040/api/`,

    //http://apps24/MesaDevoCotoDigi/devol-services-new/';
}

/* export const environment_ticket = {
    production: false,
    preProduction: false,
    staging: false,
    
    

    apiUrlpreProduction: `http://apps24/MesaDevoCotoDigi/devol-services-new/api/`,
    apiUrlproduction: `http://apps24/MesaDevoCotoDigi/devol-services/api/`,
    apiUrlstaging: `http://apps24/MesaDevoCotoDigiNueva/devol-services/api/`,
    local: `http://localhost:53979/api/`,
    desa: `http://desa4web18/MesaDevoCotoDigi/devol-services/api/`,
    desaNew: `http://desa4web18/MesaDevoCotoDigiNueva/devol-services/api/`,
    version: `${require('../../package.json').version}-dev`,
} */
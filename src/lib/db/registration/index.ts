import { createCompanyRegistration } from "./company/create";
import { createAlumniRegistration } from "./alumni/create";
import { findCompanyRegistration } from "./company/find";
import { findAlumniRegistration } from "./alumni/find";

const registrationOps = {
    createCompanyRegistration,
    createAlumniRegistration,
    findCompanyRegistration,
    findAlumniRegistration,
};

export default registrationOps;

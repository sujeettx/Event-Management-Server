import express from "express";
const router = express.Router();
import { 
    Authentication,
    authorize 
} 
from "../middlewares/auth.js";

import { 
    getHostsList,
    hostRegister
}
 from "../controllers/hostContoller.js";
import { 
    register,
    login 
} 
from "../controllers/superAdminControler.js";

router.post("/loginsuperadmin", login);                                         // Login super admin

// All routes below are authenticated
router.use(Authentication,authorize(['superadmin']));
router.post("/registerNewSuperadmin", register);                      // Register new superadmin
router.get("/getHostList", getHostsList);                             // get all host details
router.post("/registerhost", hostRegister);                           // Register new host
export default router;

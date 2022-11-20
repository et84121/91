import { Container } from "inversify";
import { AuthenticationService, IAuth } from "./AuthenticationService";
import { FailedCounter, IFailedCounter } from "./FailedCounter";
import { HashAdapter, IHash } from "./HashAdapter";
import { IOtp, OTPAdapter } from "./OtpAdapter";
import { IProfileRepo, ProfileRepo } from "./ProfileRepo";


const container = new Container();
container.bind<IFailedCounter>(FailedCounter).to(FailedCounter);
container.bind<IOtp>(OTPAdapter).to(OTPAdapter);
container.bind<IHash>(HashAdapter).to(HashAdapter);
container.bind<IProfileRepo>(ProfileRepo).to(ProfileRepo);
container.bind<IAuth>(AuthenticationService).to(AuthenticationService);


export default container;



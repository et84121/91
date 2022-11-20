import { AuthenticationService } from './AuthenticationService';
import container from './Container';

async function main() {
  const auth = container.get(AuthenticationService);

  const isVaild = auth.isVaild('aa', '1234', '123213');

  console.log(isVaild);
}

main();

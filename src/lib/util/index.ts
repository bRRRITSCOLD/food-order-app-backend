// node_modules
import * as jsonwebtoken from 'jsonwebtoken';

/**
 * 
 * @constant
 */
export const jwt = {
  verify(token: string) {
    // verify if the passed in json
    // web token is valis - it will return
    // the decoded token object if valid
    // and throw an error if it is not valid
    return jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
  },
  roles(token: string, roles: string[]) {
    // decode the passed in json web token
    const decodedToken: any = jsonwebtoken.decode(token);
    // reduce down the roles the user has
    // that match the allowed roles passed in
    const authorized: string[] = roles
      .reduce((arr: string[], role: string) => {
        if ((decodedToken.roles as string).split(';').includes('*') || (decodedToken.roles as string).split(';').includes(role))
          arr.push(role);
        return arr;
      }, []);
      // check to see if there were any
      // matching roles that were found
    if (authorized.length === 0) throw new Error('unauthorized');
    // return explicitly
    return;
  }
}
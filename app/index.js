// index.js
import { registerRootComponent } from 'expo';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'us-east-1',
      
      // ID do Pool
      userPoolId: 'us-east-1_BvQh5H6v3', 
      
      // ID do Cliente
      userPoolClientId: '5jvq0i96ffiqkhh038sg6ur0g7', 
      
      // A linha mais importante: informa que usamos login nativo
      authenticationFlowType: 'USER_SRP_AUTH',
    }
  }
});

import App from './App'; 
registerRootComponent(App);
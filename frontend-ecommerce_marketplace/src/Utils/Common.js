// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('userdata');
    if (userStr) return JSON.parse(userStr);
    else return null;
  }
  
  // return the token from the session storage
  export const getToken = () => {
    return sessionStorage.getItem('userdata') || null;
  }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    sessionStorage.removeItem('userdata');
    sessionStorage.removeItem('productId');
  }
  
  // set the token and user from the session storage
  export const setUserSession = (user) => {
    sessionStorage.setItem('userdata', JSON.stringify(user));
    sessionStorage.setItem('productId', JSON.stringify(user));
  }


// return the products ID from the session storage
  export const getProductId = () => {
    const productId = sessionStorage.getItem('productId');
    if (productId) return JSON.parse(productId);
    else return null;
  }

  export const getproductId = () => {
    return sessionStorage.getItem('productId') || null;
  }

  // set the token and user from the session storage
  export const setProductId = (producId) => {
    sessionStorage.setItem('producId', JSON.stringify(producId));
  }


import { HttpInterceptorFn } from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

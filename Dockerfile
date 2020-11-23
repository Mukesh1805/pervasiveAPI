FROM nginx:alpine 

COPY /build /usr/share/nginx

EXPOSE 80

CMD [“nginx”, “-g”, “daemon off;”]
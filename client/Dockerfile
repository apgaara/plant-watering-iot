# Menggunakan nginx sebagai base image
FROM nginx:alpine

# Salin file dari direktori client ke dalam direktori default nginx
COPY . /usr/share/nginx/html

# Expose port 80 untuk akses web
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]

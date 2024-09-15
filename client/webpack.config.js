module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/, // กำหนดให้ Webpack จับคู่กับไฟล์ .scss
        use: [
          'style-loader', // สร้างแท็ก <style> และเพิ่ม CSS ลงใน DOM
          'css-loader',   // แปลงไฟล์ CSS ให้เข้าใจโดย Webpack
          {
            loader: 'resolve-url-loader', // ใช้เพื่อปรับ URL ที่สัมพันธ์กับ SCSS
            options: {
              sourceMap: true, // เปิดการใช้งาน source map เพื่อช่วยในการ debug
            },
          },
          {
            loader: 'sass-loader', // ประมวลผลไฟล์ SCSS ไปเป็น CSS
            options: {
              sourceMap: true, // sass-loader ต้องการ source map เพื่อทำงานกับ resolve-url-loader
            },
          },
        ],
      },
    ],
  },
};

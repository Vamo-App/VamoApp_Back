import * as dotenv from 'dotenv';
dotenv.config();

const deg2rad = (deg: number): number => deg * (Math.PI / 180);

export const distance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string = 'km'): number => {
    const R = unit === 'km' ? 6371 : 3958.8;
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}
// console.log("DISTANCE: " + distance(4.64169, -74.075942,4.640116,-74.076031));
// expected: 0.17365 km (google maps) , output: 0.17529855129100733 km
// medium error: 1.6485512910073303 m (for short distances)

export const latinize = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const getStackTrace = function() {
    var obj: any = {};
    Error.captureStackTrace(obj, getStackTrace);
    const rootPath = process.cwd() + '\\';
    let stackTrace = obj.stack.split(rootPath).join('');
    return stackTrace;
};

export const planeText = (text: string): string => {
    text = latinize(text); // elimina acentos
    text = text.replace(/\s\s+/g, ' '); // elimina espacios, \t y \n duplicados
    text = text.trim(); // elimina espacios al inicio y al final
    text = text.toLowerCase(); // pasa a minusculas
    return text;
}

export const appendToLogFile = (fileName: string, log: string):void => {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
    }
    const filePath = path.join(logPath, fileName);
    fs.appendFileSync(filePath, log);
}

export const sendLogEmail = (logHtmlString: string):string|void => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NORESPONSE_EMAIL,
            pass: process.env.NORESPONSE_EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.NORESPONSE_EMAIL,
        to: process.env.VAMO_EMAIL,
        subject: "[Vamo'] Error en el backend",
        text: "Hubo un error en el servidor backend de Vamo'",
        html: `
        <img src="cid:500@vamo.com" width="600"/>
        <br>
        <p>Hubo un error en el servidor backend de Vamo'</p>
        ${logHtmlString}
        `,
        attachments: [
            {
                filename: 'internal-server-error.png',
                path: __dirname + '../../../../public/assets/internal-server-error.png',
                cid: '500@vamo.com' // should be as unique as possible
            }
        ],
    };

    const info = transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            console.log(error);
        }
    });

    if (info)
        return 'Email sent: ' + info.response;
}

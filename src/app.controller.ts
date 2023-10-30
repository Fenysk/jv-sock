import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello() {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'public', 'index.html');
        const file = fs.readFileSync(filePath, 'utf8');
        
        return file;
    }
}

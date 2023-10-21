import { Controller, Get, NotAcceptableException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtGuard, RolesGuard } from 'src/auth/guard';

@Controller('api/files')
export class UploadController {

    @Get(':path')
    seeUploadedFile(@Param('path') path: string, @Res() res: any) {
        res.sendFile(path, { root: './files' })
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('upload/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: (req, file, cb) => {

                let fileError: Error = null
                const fileName = file.originalname.split('.')[0]
                const fileExt = file.originalname.split('.')[1]
                const fileDate = new Date().toISOString().replace(/:/g, '-')

                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    fileError = new NotAcceptableException('Only image files are allowed!')
                }

                cb(fileError, `${fileName}-${fileDate}.${fileExt}`)
            }
        })
    }))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        return { path: file.path }
    }

}

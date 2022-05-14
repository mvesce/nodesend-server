const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

  //Configuración Multer
  const configuracionMulter = {
    limits: { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads')
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, `${shortid.generate()}${extension}`);
      },
    })
  }
  
  const upload = multer(configuracionMulter).single('archivo');
  
  //Subida de archivos
  upload(req, res, async(error) => {
    console.log(req.file);

    if(!error) {
      res.json({archivo: req.file.filename});
    }
    else {
      console.log(error);
      return next();
    }

  });
}

exports.eliminarArchivo = async (req, res) => {
  
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    
  } catch (error) {
    console.log(error);
  }
}


//Descarga un archivo
exports.descargar = async (req, res, next) => {

  //Obtiene el enlace
  const { archivo } = req.params;
  console.log(archivo);
  const enlace = await Enlaces.findOne( { nombre: archivo } );

  console.log(enlace);

  const archivoDescarga = __dirname + '/../uploads/' + archivo;
  res.download(archivoDescarga);

  //Eliminar archivo y la entrada de la bd
  //Si descargas === a 1 borrar entrada y archivo
  const { descargas, nombre } = enlace;
  if(descargas === 1) {
    
    //Eliminar archivo
    req.archivo = nombre;

    //Eliminar entrada de bd
    await Enlaces.findOneAndRemove(enlace.id);

    next();

  } else {
    //Si descargas > 1 restar descargas 
    enlace.descargas--;
    await enlace.save();
  }

}
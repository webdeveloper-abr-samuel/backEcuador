//const Category = require('../models').Categories;
consultant = {};
const db = require("../models");

consultant.login = async (req, res) => {
  const { usuario, pass } = req.body;
  let query = `select TOP 1 * from SSUSRS where CodUsua = '${usuario}' and strPass = '${pass}'`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

consultant.client = async (req, res) => {
  let params = req.body;
  let query = `WITH MyCTE AS (SELECT  * , ROW_NUMBER() OVER (ORDER BY Descrip asc) AS ROWNUM   FROM VW_SACLIE WITH (NOLOCK) 
    WHERE (ACTIVO=1))
   SELECT m.CodClie as nit, m.Descrip as nombreNegocio, c.Descrip as ciudadPoblacion, e.Descrip as departamento, 
   ID3, Direc1 as direccion, (m.Descrip +' - '+ m.CodClie) as nombreNegocioConNit, Direc2, Telef,MontoMax
   FROM myCTE m left join SACIUDAD c on m.Ciudad = c.Ciudad LEFT JOIN SAESTADO e on m.Estado = e.Estado
   where CodClie like '%${params.query}%' or m.Descrip like '%${params.query}%' or ID3 like '%${params.query}%' and RowNum BETWEEN 1 AND 30`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

consultant.sellers = async (req, res) => {
  let query = `WITH MyCTE AS (SELECT  * , ROW_NUMBER() OVER (ORDER BY CodVend ASC) AS ROWNUM   FROM VW_SAVEND WITH (NOLOCK) WHERE (ACTIVO=1))
    SELECT *, (SELECT MAX(ROWNUM) FROM myCTE WITH (NOLOCK)) AS TOTALROWS   FROM myCTE WITH (NOLOCK)`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

consultant.storages = async (req, res) => {
  let query = `WITH MyCTE AS (SELECT  * , ROW_NUMBER() OVER (ORDER BY CodUbic ASC) AS ROWNUM   FROM VW_SADEPO WITH (NOLOCK) WHERE (ACTIVO=1))
    SELECT CodUbic as id, Descrip as name FROM myCTE WITH (NOLOCK)`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

consultant.products = async (req, res) => {
  let params = req.body;

  let query = `WITH MyCTE AS (SELECT SP.CodProd,SP.Descrip,SP.Descrip2,SP.ESEXENTO, SP.ESENSER, SP.ACTIVO, SP.DESCRIPALL, SP.Descrip3,SP.Refere,SP.Marca,SP.DEsSeri,SP.DEsLote,SP.DEsComp,SP.CostPro,SP.CostAct,SP.DEsVence,SP.Pedido,SP.Compro,SP.Minimo,SP.Maximo,SP.Unidad,SP.CantEmpaq,SP.UndEmpaq,SP.Precio1,SP.Precio2,SP.Precio3,SP.PrecioU,SP.PrecioU2,SP.PrecioU3, SP.Existen , ROW_NUMBER() OVER (ORDER BY SP.CodProd ASC) AS ROWNUM   FROM VW_ADM_PRODUCTOS SP WITH (NOLOCK) 
    WHERE ((SP.CodProd LIKE '%${params.query}%') OR (SP.DescripAll LIKE '%${params.query}%') OR (SP.Refere LIKE '%${params.query}%') OR (SP.Existen LIKE '%${params.query}%'))  AND (SP.Activo=1)  AND (SP.EsEnser=0) )
    SELECT *, (SELECT MAX(ROWNUM) FROM myCTE WITH (NOLOCK)) AS TOTALROWS   FROM myCTE WITH (NOLOCK) WHERE RowNum BETWEEN 1 AND 30`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

consultant.saveOrder = async (req, res) => {
  const { encabezado, detalle } = req.body;

  let queryDetalle = "";
  let produccion = 0;

  for (i = 0; i < detalle.length; i++) {
    produccion = produccion + detalle[i].CostoPrd;
    if (i == detalle.length - 1) {
      queryDetalle =
        queryDetalle +
        `('00000','G',@NUMEROFAC,${i + 1},1,GETDATE(),'${
          detalle[i].CostPro
        }','${detalle[i].Refere}', '${encabezado.CodUbic}','${
          detalle[i].Descrip
        }','${detalle[i].Descrip2}','${detalle[i].Descrip3}',${
          detalle[i].cantidad
        },${detalle[i].CostPro}, ${detalle[i].total}, ${detalle[i].Precio1}, ${
          detalle[i].Precio1
        }, ${detalle[i].Precio1 * 0.19},'${
          encabezado.CodVend
        }',ISNULL(@NROUNICOLOT,0), ISNULL(@EXISTANTUND,0),ISNULL(@EXISTANT,0));`;
    } else {
      queryDetalle =
        queryDetalle +
        `('00000','G',@NUMEROFAC,${i + 1},1,GETDATE(),'${
          detalle[i].CostPro
        }','${detalle[i].Refere}', '${encabezado.CodUbic}','${
          detalle[i].Descrip
        }','${detalle[i].Descrip2}','${detalle[i].Descrip3}',${
          detalle[i].cantidad
        },${detalle[i].CostPro}, ${detalle[i].total}, ${detalle[i].Precio1}, ${
          detalle[i].Precio1
        }, ${detalle[i].Precio1 * 0.19},'${
          encabezado.CodVend
        }',ISNULL(@NROUNICOLOT,0), ISNULL(@EXISTANTUND,0),ISNULL(@EXISTANT,0)),`;
    }
  }

  let query = `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
    BEGIN TRANSACTION VENTA
    SET DATEFORMAT YMD;
    DECLARE 
     @OCANT        decimal(28,4),
     @CANT         decimal(28,4),
     @PORCT        DECIMAL(28,4),
     @MONTO        DECIMAL(28,4),
     @MONTOTAX     DECIMAL(28,4),
     @EXISTPRD     DECIMAL(28,4),
     @EXISTANT     DECIMAL(28,4),
     @EXISTANTUND  DECIMAL(28,4),
     @NUMEROFAC    VARCHAR(20),
     @NUMERODES    VARCHAR(20),
     @NUMERONCR    VARCHAR(20),
     @NUMEROREC    VARCHAR(20),
     @NUMEROAUD    VARCHAR(20),
     @IMPUESTOTJT  DECIMAL(28,3),
     @COMISIONTJT  DECIMAL(28,3),
     @RETENCIVATJT DECIMAL(28,3),
     @RETENCIONTJT DECIMAL(28,3),
     @CORRELATIVO  INT,
     @LENCORREL    INT,
     @PROXNUMBER   INT,
     @NROUNICO     INT,
     @NROUNICOFAC  INT,
     @NROUNICOAUD  INT,
     @NROREGISERI  INT,
     @NROUNICOCXC  INT,
     @NROUNICORETI INT,
     @NROUNICOREC  INT,
     @NROUNICOLOT  INT,
     @NROUNICONCR  INT,
     @NUMERRORS    INT;
    SET @LENCORREL=8;
    SET @CORRELATIVO=1;
    SET @NROUNICOFAC=0;
    SET @NUMERRORS=0;
    SET @EXISTPRD=0;
    EXEC SP_ADM_PROXCORREL '00000',NULL,'','PrxFactEs',@NUMEROFAC OUTPUT;
    IF NOT EXISTS(SELECT NUMEROD FROM SAFACT WITH (NOLOCK) 
                   WHERE CODSUCU='00000' AND 
                         TIPOFAC='G' AND NUMEROD=@NUMEROFAC)
       BEGIN
    INSERT INTO SAFACT ([CodSucu],[TipoFac],[NumeroD],[EsCorrel],[FechaT],[FechaI],[FechaE],[FechaV],
              [CodUsua],[CodEsta],[Signo],[Factor],[CodClie],[CodVend],[CodUbic],[Descrip],
              [Direc1],[Direc2],[Telef],[ID3],[Monto],[MtoTotal],[Credito],[TotalPrd],[TGravable],[MtoTax])
           VALUES ('00000','G',@NUMEROFAC,@CORRELATIVO,GETDATE(),GETDATE(),GETDATE(),GETDATE(),
              '${encabezado.CodUsua}','EPICORRA',1,1,'${encabezado.CodClie}','${
    encabezado.CodVend
  }','${encabezado.CodUbic}','${encabezado.Descrip}', '${encabezado.Direc1}','${
    encabezado.Direc2
  }','${encabezado.Telef}','${encabezado.ID3}', ${encabezado.monto},${
    encabezado.monto * 1.19
  },${encabezado.monto * 1.19},${encabezado.monto},${encabezado.monto},${
    encabezado.monto * 0.19
  });
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    SET @NROUNICOFAC=IDENT_CURRENT('SAFACT');
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    DELETE FROM SAITEMFAC WHERE (CodSucu='00000') And (TipoFac='G') And (NumeroD=@NUMEROFAC);
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    DELETE FROM SATAXITF WHERE (CodSucu='00000') And (TipoFac='G') And (NumeroD=@NUMEROFAC);
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    DELETE FROM SASEPRFAC WHERE (CodSucu='00000') And (TipoFac='G') And (NumeroD=@NUMEROFAC);
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    SET @NROUNICOLOT=0;
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    INSERT INTO SAITEMFAC ([CodSucu],[TipoFac],[NumeroD],[NroLinea],[Signo],[FechaE],[CodItem],[Refere],
              [CodUbic],[Descrip1],[Descrip2],[Descrip3],[CantMayor],[Costo],[TotalItem],
              [Precio],[PriceO],[MtoTax],[CodVend],[NroUnicoL],[ExistAntU],[ExistAnt])
           VALUES ${queryDetalle}
    SET @NUMERRORS=@NUMERRORS+@@ERROR;
    UPDATE SAFACT SET 
       CostoPrd=0   ,CostoSrv=0   ,MtoComiVta=0   ,MtoComiVtaD=0   ,MtoComiCob=0   ,MtoComiCobD=0  WHERE (CODSUCU='00000') AND (TIPOFAC='G') AND (NUMEROD=@NUMEROFAC);
       END
    ELSE
      SET  @NUMERRORS=1004;
    IF @NUMERRORS>0
       ROLLBACK TRANSACTION VENTA;
    ELSE
       COMMIT TRANSACTION VENTA;
    SELECT @NUMERRORS AS ERROR, ISNULL(@NUMEROFAC,'') AS NUMEROD, ISNULL(@NUMERODES,'') AS NUMERODES, ISNULL(@NROUNICOFAC, 0) AS NROUNICOFAC, ISNULL(@NROUNICOREC, 0) AS NROUNICOREC, ISNULL(@NROUNICONCR, 0) AS NROUNICONCR`;

  try {
    const data = await db.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      data,
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = consultant;

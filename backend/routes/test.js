const express = require('express');
const router = express.Router();

const { checkSchema,validationResult } = require("express-validator")

const specialRegExp = /[!@#$%^&*()]+/;

const schema={
    name:{
        in:"body",
        isAlphanumeric:{
            errorMessage:"ID must be alphanumeric"
        }
    },
    password:{
        in:"body",
        isLength:{
            errorMessage:"Password length error",
            options:{min:8,max:20}
        },
        matches:{
            errorMessage:"Password must contain one special character",
            options:specialRegExp
        }
    },
    email:{
        in:"body",
        isEmail:{errorMessage:"invalid email"}
    }
}

const validate = checkSchema(schema);

router.get('/test1', (req, res) => {
    console.log(JSON.stringify(req.body))
    res.status(200).json({
        success:true,
        message: "hello world!"
    })
})

router.get('/validate',validate,(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    return res.status(200).send({success:true});
})

module.exports = router;
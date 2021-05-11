const router = require('express').Router();
const finishedGood = require('../db').import('../models/finishedGood');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require('../middleware/validate-session');
const BOM = require('../models/BOM');

// const rawGood = require('../models/rawGood');

router.post('/finishedGood', function (req, res) {
    BOM.findAll({ where: { userId: req.user.id } }).then((BOMList) => {
        FinishedGood.create({
            fgName: BOMList,
            fgSRP: req.body.finishedGood.fgSRP,
            fgCOGS: BOMList,
            fgMakerPrice: req.body.finshedGood.fgMakerPrice,
            owner: req.user.id
        })
            .then(
                function createSuccess(finishedGood) {
                    res.json({
                        finishedGood: finishedGood,
                        message: "New finished product entry successful",
                        sessionToken: token
                    });
                })
            
        })
        .catch(err => res.status(500).json({ error: err }))
});


router.get("/finishedlist", validateSession, (req, res) => {
    let userid = req.user.id
    FinishedGood.findAll({
        where: { owner: userid }
    })
        .then(finishedGood => res.status(200).json(finishedGood))
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/finishededit/:entryId', validateSession, function (req, res) {
    const editfinishedGood = {
        fgName: req.body.finishedGood.fgName,
        fgSRP: req.body.finishedGood.fgSRP,
        fgCOGS: req.body.finishedGood.fgCOGS,
        fgMakerPrice: req.body.finshedGood.fgMakerPrice,
    };
    const query = { where: { id: req.params.entryId, owner: req.user.id } }
    RawGood.update(editfinishedGood, query)
        .then((finishedGood) => res.status(200).json(finishedgood))
        .catch((err) => res.status(500).json({ error: err }))
})

router.delete('/finisheddelete/:id', validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner: req.user.id } };

    FinishedGood.destroy(query)
        .then(() => res.status(200).json({ message: "Entry Removed FG" }))
        .catch((err) => res.status(500).json({ error: err }))

})





module.exports = router;
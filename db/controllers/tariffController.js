const ApiError = require('../error/ApiError')
const {Tariff, Privilege} = require('../models/models')
const {createTariffValidation} = require('../validations/tariff/createTariffValidation')
const {updateTariffValidation} = require('../validations/tariff/updateTariffValidation')

class TariffController {
  async getTariffs(req, res) {
    try {
      const tariffs = await Tariff.findAll();
      return res.json(tariffs)
    } catch (e) {
      console.log(e)
    }
  }

  async getTariff(req, res) {
    try {
      const {id} = req.params
      let tariffItem;
      const tariff = await Tariff.findOne({where: {id: id}}).then(tariff => {
        if(!tariff) return tariff;
        tariffItem = tariff;
        return tariff.getPrivileges()
      })

      return res.json({tariff: tariffItem, privileges: tariff})
    } catch (e) {
      console.log(e)
    }
  }

  async createTariff(req, res, next) {
    try {
      const {error} = createTariffValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {title, description, price, discount, privileges} = req.body
      const tariff = await Tariff.create({title, description, price, discount})
      for (const i of privileges) {
        const privilege = await Privilege.findOne({where: {id: i.id}})
        tariff.addPrivilege(privilege)
      }
      return res.json(tariff);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteTariff(req, res) {
    try {
      const {id} = req.params
      await Tariff.findOne({where: {id: id}})
        .then(tariff=>{
          if(!tariff) return;
          tariff.getPrivileges().then(privileges=>{
            for(let i = 0; i < privileges.length; i++){
              if(tariff.id===privileges[i]['privilege_tariff'].tariffId) privileges[i]['privilege_tariff'].destroy();
            }
          });
        });
      await Tariff.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchTariff(req, res, next) {
    try {
      const {error} = updateTariffValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      const {id} = req.params
      const {title, description, price, discount, privileges} = req.body
      const tariff = await Tariff.findOne({where: {id: id}})

      await tariff.update({title: title, description: description, price: price, discount: discount})
      const tariffItem = await tariff.getPrivileges()


      if (tariffItem.length > privileges.length || tariffItem.length < privileges.length || tariffItem.length === privileges.length) {
        if (tariffItem.length !== 0) {
          for (let i = 0; i < tariffItem.length; i++) {
            tariffItem[i]['privilege_tariff'].destroy();
          }
        }
        if (privileges.length !== 0) {
          for (const i of privileges) {
            const privilegeItem = await Privilege.findOne({where: {id: i.id}})
            if (privilegeItem) await tariff.addPrivilege(privilegeItem)
          }
        }
      }

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new TariffController()
import {isArray} from 'lodash';

const MATERIAL_BASE = "appJjTJzue1NyLL0D";
const MODEL_BASE = "appQcA3Nein2QYGww";
const baseUrl = 'https://api.airtable.com/v0';
const headers = { 'Authorization' : 'Bearer keyBgvIWR5J8BoZI1' };

const e = encodeURIComponent;

const querystring = (obj) => Object.keys(obj)
    .map(p => {
        if (isArray(obj[p])) {
            return obj[p].map(v => `${e(p)}[]=${v}`).join("&")
        } else {
            return `${e(p)}=${e(obj[p])}`;
        }
    })
    .join("&")

const json = async (url, options) => {
    var response = await fetch(url, options);
    return await response.json();
}

const find = async (base, table, id, params) => {
    var query = querystring(params);
    return await json(`${baseUrl}/${base}/${table}/${id}?${query}`,  { headers });
}

const list = async (base, table, view, params) => {
    var query = querystring(params);
    return await json(`${baseUrl}/${base}/${table}?view=${view}&${query}`,  { headers });
}

export default {
    async getMaterials(params) {
        return await list(MATERIAL_BASE,  "Материалы",  "Каталог материалов", 
            Object.assign({ fields: ['Код','Остаток', 'Скан', 'Все свойства'] }, params));
    },
    async findSpec(shopifyId) {
        var response = await list(MODEL_BASE,  "Модели",  "Все", { fields: ['Key', 'additions_ru'],  filterByFormula: `shopify_id=${shopifyId}`});
        if (response.records && response.records.length > 0) {
            if (response.records.length > 1) {
                console.warn(`More than one model exists: ${shopifyId}`);
            }
            var model = response.records[0];
            response = await list(MODEL_BASE,  "Себестоимость",  "Edit costs", { filterByFormula: `FIND("${model.id}",""&model_id)>0`});
            return {
                model: model,
                spec: response.records
            };
        }
    }
}
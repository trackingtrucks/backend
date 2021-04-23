import { json } from 'express';
import app from '../app'
export const root = async (req, res) => {
    res.json({
        name: app.get('pkg').name,
        autor: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
}
export const specific = async (req, res) => {
    try {
        if (req.params.coso === "package.json" || req.params.coso === "package"){
            return res.json(app.get('pkg'))
        }
        const search = app.get('pkg')[req.params.coso]
        if (search === undefined) {
            return res.json('No se pudo obtener la informacion ' + req.params.coso + " por favor intenta con otro parametro")
        }
        const searchItem = {
            [req.params.coso]: search
        }
        res.json(searchItem)
        // const search = app.get('pkg')
        // res.json(item)
    } catch (error) {
        res.json('No se pudo obtener la ruta ' + req.url)
    }
}
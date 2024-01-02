const oilController = require('../controller/oilController'); 
const { userModel, oilModel } = require("../models");


require('dotenv').config();
// token jwt
const jwt = require('jsonwebtoken');

// Mock du modèle userModel pour simuler son comportement
jest.mock('../models/oil');



                                    /*        GETOILBYID **/
// npm test -- server/test/oil.test.js --testNamePattern="getOilById"
describe('oilController', () => {
        describe('getOilById', () => {
            it('should return an oil by id', async () => {
                // Créez un objet de requête et de réponse simulé
                const req = {
                params: {
                    id: 1,
                },
                };
                const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                };
            
                // Définissez le comportement simulé du modèle `oilModel`
                oilModel.getOneOilById.mockResolvedValue({
                    id: 1,
                    });
            
                // Appelez la méthode de contrôleur
                await oilController.getOilById(req, res);
            
                // Vérifiez si le statut est correct (200 OK)
                expect(res.status).toHaveBeenCalledWith(200);
            
                // Vérifiez si la réponse JSON contient les données attendues
                const expected = {
                id: 1,
                };
                expect(res.json).toHaveBeenCalledWith(expected);
            });

            it('should return an error if the oil id is invalid', async () => {
                // Créez un objet de requête et de réponse simulé
                const req = {
                params: {
                    id: '110',
                },
                };
    
                const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                };
            
                // Définissez le comportement simulé du modèle `oilModel`
                oilModel.getOneOilById.mockResolvedValue(null);
            
                // Appelez la méthode de contrôleur
                await oilController.getOilById(req, res);
            
                // Vérifiez si le statut est correct (500 Internal Server Error)
                expect(res.status).toHaveBeenCalledWith(500);
            
                // Vérifiez si la réponse JSON contient le message d'erreur attendu
                const expected = {
                message: `Huile avec l'id 110 n'a pas été trouvée.`,
                };
                expect(res.json).toHaveBeenCalledWith(expected);
            });
        }); 
    });



                                    /*        CREATEOIL **/
// npm test -- server/test/oil.test.js --testNamePattern="createOil"
    describe('createOil', () => {
        it('should create an oil', async () => {
            // Créez un objet de requête et de réponse simulé
            const req = {
            method: 'POST', // METHODE POST pour Create
            body: {
                id: 120,
                name: 'Lilia',
                botanic_name: 'Lavandula angustifolia',
                description: 'Une huile essentielle aux propriétés relaxantes et apaisantes.',
                extraction: 'Distillation à la vapeur',
                molecule: 'Linalol',
                plant_family: 'Lamiaceae',
                scent: 'floréal',
                image: 'lol.png',
            },
            };
            const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            };
        
            // Définissez le comportement simulé du modèle `oilModel`
            oilModel.insertOil.mockResolvedValue({
                id: 120,
                name: 'Lilia',
                botanic_name: 'Lavandula angustifolia',
                description: 'Une huile essentielle aux propriétés relaxantes et apaisantes.',
                extraction: 'Distillation à la vapeur',
                molecule: 'Linalol',
                plant_family: 'Lamiaceae',
                scent: 'floréal',
                image: 'lol.png',
            });
        
            // Appelez la méthode de contrôleur
            await oilController.createOil(req, res);
        
            // Vérifiez si le statut est correct (201 Created)
            expect(res.status).toHaveBeenCalledWith(201);
        
            // Vérifiez si la réponse JSON contient les données attendues
            const expected = {
                id: 120,
                name: 'Lilia',
                botanic_name: 'Lavandula angustifolia',
                description: 'Une huile essentielle aux propriétés relaxantes et apaisantes.',
                extraction: 'Distillation à la vapeur',
                molecule: 'Linalol',
                plant_family: 'Lamiaceae',
                scent: 'floréal',
                image: 'lol.png',
            };
            expect(res.json).toHaveBeenCalledWith(expected);
        });

        
        it('should not create an oil if name is missing', async () => {
            // Créez un objet de requête et de réponse simulé
            const req = {
            method: 'POST', // METHODE POST pour Create
            body: {
                id: 120,
                botanic_name: 'Lavandula angustifolia',
                description: 'Une huile essentielle aux propriétés relaxantes et apaisantes.',
                extraction: 'Distillation à la vapeur',
                molecule: '',
                plant_family: '',
                scent: 'floréal',
                image: 'lol.png',
            },
            };
            const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            };
        
            // Définissez le comportement simulé du modèle `oilModel`
            oilModel.insertOil.mockResolvedValue({
            id: 120,
            name: 'Lilia',
            botanic_name: 'Lavandula angustifolia',
            description: 'Une huile essentielle aux propriétés relaxantes et apaisantes.',
            extraction: 'Distillation à la vapeur',
            molecule: '',
            plant_family: '',
            scent: 'floréal',
            image: 'lol.png',
            });
        
            // Appelez la méthode de contrôleur
            await oilController.createOil(req, res);
        
            // Vérifiez si le statut est correct (201 Created)
            expect(res.status).toHaveBeenCalledWith(400);
        
            // Vérifiez si la réponse JSON contient le message d'erreur attendu
            const expected = {
            message: 'Tous les champs doivent être remplis',
            };
            expect(res.json).toHaveBeenCalledWith(expected);
      });
});
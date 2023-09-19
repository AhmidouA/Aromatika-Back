// Importez les modules nécessaires
const userController = require('../controller/userController'); // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers
const { userModel, oilModel } = require("../models"); // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers


require('dotenv').config();
// token jwt
const jwt = require('jsonwebtoken');

// Mock du modèle userModel pour simuler son comportement
jest.mock('../models/user');


                                    /*        SIGNUP **/
// npm test -- server/test/user.test.js --testNamePattern="signup"
describe('userController', () => {
    describe('signup', () => {
      it('should create a new user and return a success message', async () => {
        // Créez un objet de requête et de réponse simulé
        const req = {
          body: {
            username: 'lolia',
            email: 'lolia@example.com',
            password: 'test',
            confirmPassword: 'test'
            // Ajoutez d'autres propriétés de formulaire simulées selon vos besoins
          },
        };

        const res = {
            // mockReturnThis() est utilisée pour que la méthode status() retourne simplement l'objet res lui-même
            status: jest.fn().mockReturnThis(), 
            json: jest.fn(),
        };
  
        // Définissez le comportement simulé du modèle userModel
        // mockResolvedValue une fonction de Jest qui permet de définir le comportement simulé d'une fonction asynchrone
        userModel.insertUser.mockResolvedValue({
            username: 'lolia',
            email: 'lolia@example.com',
            password: 'test',
            confirmPassword: 'test'
        }); 
  
        // Appelez la méthode de contrôleur
        await userController.signup(req, res);
  
        // Vérifiez si le statut est correct (201 Created)
        expect(res.status).toHaveBeenCalledWith(201);
        
        // Vérifiez si la réponse JSON contient les données attendues
         const expected = {
            "Message": "Bienvenu ",
            "name": "lolia",
          };
          expect(res.json).toHaveBeenCalledWith(expected);
        });
  
        
      it('should return an error message if username or email is already used', async () => {
        // Créez un objet de requête et de réponse simulé
        const req = {
          body: {
            username: 'Ahmed',
            email: 'existing@example.com',
            password: 'test',
            confirmPassword: 'test'
            // Ajoutez d'autres propriétés de formulaire simulées selon vos besoins
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Définissez le comportement simulé du modèle userModel
        userModel.insertUser.mockRejectedValue(new Error('Duplicate entry')); // Utilisateur déjà existant
  
        // Appelez la méthode de contrôleur
        await userController.signup(req, res);
  
        // Vérifiez si le statut est correct (500 Internal Server Error)
        expect(res.status).toHaveBeenCalledWith(500);
  
        // Vérifiez si le message d'erreur est correct
        expect(res.json).toHaveBeenCalledWith({
          message: 'Le Pseudo ou l\'email est déjà utilisé',
        });
      });
    });
  });







                                        /*        LOGIN **/
// npm test -- server/test/user.test.js --testNamePattern="login"
describe('userController', () => {
  describe('login', () => {
    it('should return user data and token on successful login', async () => {
      // Créez un objet de requête et de réponse simulé
      const req = {
        body: {
          email: 'Marie@oclock.com',
          password: 'Marie',
        },
      };
      
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(), // ligne pour définir res.status
      };

       // Appelez la méthode de contrôleur
       await userController.login(req, res);

       // Définissez le comportement simulé du modèle userModel
        await userModel.loginUser.mockResolvedValue({
            email: 'Marie@oclock.com',
            password: 'Marie',
        });

      // générer le token
      const token = jwt.sign({  email: 'Marie@oclock.com', user_id: 6 },process.env.SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Vérifiez si la réponse JSON contient les données attendues
      const expected = {
        name: "Marie",
        user_id: 6,
        token: token, // Vérifiez si un token est retourné
        };    
        expect(res.json).toHaveBeenCalledWith(expected);      
    });



    it('should return an error message on unsuccessful login', async () => {
      // Créez un objet de requête et de réponse simulé
      const req = {
        body: {
          email: 'test@example.com',
          password: 'incorrectpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Définissez le comportement simulé du modèle userModel
      userModel.loginUser.mockResolvedValue(null); // Utilisateur non trouvé

      // Appelez la méthode de contrôleur
      await userController.login(req, res);

      // Vérifiez si le statut et le message d'erreur sont corrects
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'utilisateur ou mot de passe incorrect',
      });
    });
  });
});






                                        /*        PROFILE **/
// npm test -- server/test/user.test.js --testNamePattern="profile"
describe('userController', () => {
    describe('profile', () => {
      it('should return the user\'s profile data', async () => {
        // Créez un objet de requête et de réponse simulé
        const req = {
          token: {
            userMail: 'Ahmed@oclock.com',
            user: {
              id: 5,
              name: 'Ahmed',
              createdAt: '2023-09-07T16:46:06.472Z',
              role_id: 1,
              image: '1694541884894.png',
            },
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Définissez le comportement simulé du modèle userModel
        userModel.findFavoritesByUserId.mockResolvedValue([
          {
            id: 1,
            oil_id: 2,
            user_id: 5,
          },
        ]);
        userModel.findAromathequeByUserId.mockResolvedValue([
          {
            id: 1,
            oil_id: 3,
            user_id: 5,
          },
        ]);
        userModel.getUserById.mockResolvedValue({
          id: 5,
          name: 'Ahmed',
          createdAt: '2023-09-07T16:46:06.472Z',
          role_id: 1,
          image: '1694541884894.png',
        });
  
        // Appelez la méthode de contrôleur
        await userController.profile(req, res);
  
        // Vérifiez si le statut est correct (200 OK)
        expect(res.status).toHaveBeenCalledWith(200);
  
        // Vérifiez si la réponse JSON contient les données attendues
        const expected = {
          Message: "Vous etes bien authentifié avec l'email ",
          userMail: "Ahmed@oclock.com",
          created_at: "2023-09-07T16:46:06.472Z",
          userName: "Ahmed",
          userFavorites: [
            {
              id: 1,
              oil_id: 2,
              user_id: 5,
            },
          ],
          userAromatheques: [
            {
              id: 1,
              oil_id: 3,
              user_id: 5,
            },
          ],
          userImage: '1694541884894.png',
          userId: 5,
        };
        expect(res.json).toHaveBeenCalledWith(expected);
      });


      
      it('should return an error message if the token is invalid', async () => {

        // Créez un objet de requête et de réponse simulé
        const req = {
          token: {
            userMail: 'Ahmed@oclock.comm',
            user: {
              id: 4,
              name: 'Ahmed',
              createdAt: '2023-09-07T16:46:06.472Z',
              role_id: 1,
              image: '1694541884894.png',
            },
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Définissez le comportement simulé du modèle userModel
        userModel.findFavoritesByUserId.mockResolvedValue([
          {
            id: 1,
            oil_id: 2,
            user_id: 5,
          },
        ]);
        userModel.findAromathequeByUserId.mockResolvedValue([
          {
            id: 1,
            oil_id: 3,
            user_id: 5,
          },
        ]);
        userModel.getUserById.mockRejectedValue({
          message: "",
        });
      
        // Appelez la méthode de contrôleur
        await userController.profile(req, res);
      
        // Vérifiez si le statut est correct (401 Unauthorized)
        expect(res.status).toHaveBeenCalledWith(401);
      
        // Vérifiez si la réponse JSON contient le message d'erreur attendu
        const expected = {
          message: "",
        };
        expect(res.json).toHaveBeenCalledWith(expected);
      });
    });
});





                                        /*        UPDATEUSERNAME **/
// npm test -- server/test/user.test.js --testNamePattern="updateUsername"
describe('userController', () => {
    describe('updateUsername', () => {
      it('should update the username and return a success message', async () => {
        const req = {
          params: {
            id: 5,
          },
          body: {
            username: 'AhmidouA',
          },
          token: {
            user: {
              id: 5,
              name: 'Ahmed',
            },
          },
        };
  
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
  
        // Mock du comportement attendu de userModel.getUserByUsername
        userModel.getUserByUsername.mockResolvedValue(null);
  
        // Mock du comportement attendu de userModel.getUserById
        userModel.getUserById.mockResolvedValue({
          id: 5,
          username: 'Ahmed',
        });
  
        // Mock du comportement attendu de userModel.updateUsername
        userModel.updateUsername.mockResolvedValue('AhmidouA');
  
        // Appeler la méthode de contrôleur
        await userController.updateUsername(req, res);
  
        // Vérifier le résultat
        expect(res.json).toHaveBeenCalledWith({
          message: 'Le Pseudo a été modifié avec succès',
          username: 'AhmidouA',
        });
      });
  
      it('should return an error message if username is already taken', async () => {
        const req = {
          params: {
            id: 5,
          },
          body: {
            username: 'Marie',
          },
          token: {
            user: {
              id: 1,
              name: 'Ahmed',
            },
          },
        };
  
        const res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
  
        // Mock du comportement attendu de userModel.getUserByUsername
        userModel.getUserByUsername.mockResolvedValue({
          id: 2,
          username: 'Marie',
        });
  
        // Appeler la méthode de contrôleur
        await userController.updateUsername(req, res);
  
        // Vérifier le résultat
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: `Ce nom d'utilisateur est déjà pris.`,
        });
      });
  
      // Ajouter d'autres tests en fonction de vos besoins
  
      // Assurez-vous de nettoyer ou de réinitialiser les mocks après chaque test si nécessaire
      afterEach(() => {
        jest.clearAllMocks();
      });
    });
  });
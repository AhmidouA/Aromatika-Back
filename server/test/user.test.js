// Importez les modules nécessaires
const userController = require('../controller/userController'); // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers
const userModel = require('../models/user'); // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers

// Mock du modèle userModel pour simuler son comportement
jest.mock('../models/user');

describe('userController', () => {
  describe('login', () => {
    it('should return user data and token on successful login', async () => {
      // Créez un objet de requête et de réponse simulé
      const req = {
        body: {
          email: 'Ahmed@oclock.com',
          password: 'Ahmed',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(), // ligne pour définir res.status
      };

      // Définissez le comportement simulé du modèle userModel
      userModel.loginUser.mockResolvedValue({
        id: 5,
        username: 'AhmidouA',
        email: 'Ahmed@oclock.com',
        role_id: 1, // Ajoutez d'autres propriétés utilisateur simulées selon votre besoin
        });

      // Appelez la méthode de contrôleur
      await userController.login(req, res);

      // Vérifiez si la réponse JSON contient les données attendues
      expect(res.json).toHaveBeenCalledWith({
        name: 'AhmidouA',
        user_id: 5,
        token: expect.any(String), // Vérifiez si un token est retourné
      });
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

    // Ajoutez d'autres cas de test en fonction de vos besoins
  });

  // Ajoutez d'autres describe et it pour tester d'autres méthodes du contrôleur
});
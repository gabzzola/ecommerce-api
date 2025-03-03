import express from "express";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import { initializeApp as initializeFirebaseApp } from "firebase/app";
import { routes } from "./routes/index";
import { auth } from "./middlewares/auth.middleware";
import { pageNotFoundHandler } from "./middlewares/page-not-found.middleware";
import { errorHandler } from "./middlewares/error-handler.middleware";

initializeAdminApp();
initializeFirebaseApp({
	apiKey: process.env.API_KEY
});

const app = express();
const PORT = process.env.PORT || 3000;

auth(app);
routes(app);
pageNotFoundHandler(app);
errorHandler(app);

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});


import "reflect-metadata";
import Express from "express";
import AppDataSource from "./data-source";
import userRoutes from "./controllers/user-controller";

AppDataSource.initialize().then(() => {
    const app = Express();
    app.use(Express.json());
    app.use('/api', userRoutes);
    app.get('/', (req, res) => {
        return res.json('DB connected!');
    });
    const PORT = 3000;
    return app.listen(3000, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.log('db connection failed ', err);
});
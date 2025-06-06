import express, { Express, Request, Response, NextFunction } from 'express';

const app: Express = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(function (req: Request, res: Response, next: NextFunction) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Content-Type', 'application/json');
	next();
});

// ROUTES
/* The line `// import archive from './routes/archive';` is a commented-out import statement in the
TypeScript code. This means that the code is not currently importing the `archive` module from the
`./routes/archive` file. The purpose of commenting out this line is to disable this import statement
so that the `archive` module is not included in the application at the moment. */
import archive from './routes/archive';
import blog from './routes/blog';
// import form from './routes/form';
// import contact from './routes/contact';
// import home from './routes/home';

app.use('/api/archive', archive);
app.use('/api/blog', blog);
// app.use('/api/form', form);
// app.use('/api/contact', contact);
// app.use('/api/home', home);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

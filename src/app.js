const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositorieID);

const repositories = [];

function validateRepositorieID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: 'Invalid repositorie ID.' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(r => r.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found." });
  }

  const {title, url, techs} = request.body;
  const { likes } = repositories[repositorieIndex];

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(r => r.id === id);

  if (repositorieIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repositorie not found.' });
  }

  repositories.splice(repositorieIndex, 1);

  return response
    .status(204)
    .send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(r => r.id === id);

  if (repositorieIndex < 0) {
    return response
      .status(400)
      .json({ error: 'Repositorie not found.' });
  }

  const repositorie = repositories[repositorieIndex];

  repositorie.likes += 1;

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;

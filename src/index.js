const express = require("express");

const { v4: uuidv4, validate } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  if (request.body.likes > 0) {
    return response.status(500).json({ error: "It is not possible to update values likes manually" });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
  
  updatedRepository.likes = 0

  updatedRepository.title = updatedRepository.title.length > 0
  ? updatedRepository.title 
  : repositories[repositoryIndex].title

  updatedRepository.url = updatedRepository.url.length > 0
  ? updatedRepository.url 
  : repositories[repositoryIndex].url

  updatedRepository.techs = updatedRepository.techs.length > 0 
  ? updatedRepository.techs 
  : repositories[repositoryIndex].techs
  
  const repository = { ...repositories[repositoryIndex], ...updatedRepository };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json(likes);
});

module.exports = app;

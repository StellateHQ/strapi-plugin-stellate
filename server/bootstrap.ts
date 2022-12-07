import { Strapi } from "@strapi/strapi";
import fetch from "node-fetch";

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.db.lifecycles.subscribe(async (event) => {
    switch (event.action) {
      case "afterCreate":
      case "afterCreateMany":
      case "afterDelete":
      case "afterDeleteMany":
      case "afterUpdate":
      case "afterUpdateMany":
        const contentType = strapi.contentType(event.model.uid);
        if (!contentType) break;

        const typeNames = getGraphQLTypenamesFromContentType(
          strapi,
          contentType
        );

        await Promise.all(typeNames.map((typeName) => purge(strapi, typeName)));
    }
  });
};

function purge(strapi, typeName) {
  const purgingAPIToken = strapi.plugin("stellate").config("purgingAPIToken");
  const serviceName = strapi.plugin("stellate").config("serviceName");
  const soft = strapi.plugin("stellate").config("soft");

  if (!purgingAPIToken || !serviceName)
    throw new Error("Missing purgingAPIToken or serviceName.");

  return fetch(`https://admin.stellate.co/${serviceName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      'stellate-token': purgingAPIToken,
    },
    body: JSON.stringify({
      query: `mutation {
        purge${typeName}(soft: ${soft || "false"})
      }`,
    }),
  });
}

function getGraphQLTypenamesFromContentType(strapi, contentType) {
  const { service: getService } = strapi.plugin("graphql");
  const { naming } = getService("utils");

  const graphqlTypeName = naming.getTypeName(contentType);
  const graphqlEntityName = naming.getEntityName(contentType);
  const graphqlEntityResponseName = naming.getEntityResponseName(contentType);
  const graphqlEntityResponseCollectionName =
    naming.getEntityResponseCollectionName(contentType);
  const graphqlRelationResponseCollectionName =
    naming.getRelationResponseCollectionName(contentType);

  return [
    graphqlTypeName,
    graphqlEntityName,
    graphqlEntityResponseName,
    graphqlEntityResponseCollectionName,
    graphqlRelationResponseCollectionName,
  ];
}

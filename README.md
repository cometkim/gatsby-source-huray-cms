# gatsby-source-huray-cms

Gatsby source plugin to fetch contents from [Huray CMS](https://github.com/cometkim/huray-cms)

## How to query

```graphql
{
    allHurayContents {
        edges {
            node {
                id
                title
                description
                category
                tags
                createdAt
                updatedAt
                author {
                    username
                    email
                }
                customFields {
                    key
                    label
                    type
                    value
                }
                attachments {
                    id
                }
            }
        }
    }
}
```

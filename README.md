# gatsby-source-huray-cms

[![Greenkeeper badge](https://badges.greenkeeper.io/cometkim/gatsby-source-huray-cms.svg)](https://greenkeeper.io/)

Gatsby source plugin to fetch contents from [Huray CMS](https://github.com/cometkim/huray-cms)

## How to use

```js
// In your gatsby-config.js
plugins: [
    {
        resolve: 'gatsby-source-huray-cms',
        options: {
            url: '', // URL of Huray CMS
            username: '', // Username for login user
            password: '', // Password for login user
            imageBaseUrl: '/',
        },
    },
]
```

## How to query

```graphql
{
    allHurayContent {
        edges {
            node {
                contentId
                title
                description
                category
                tags
                created_at
                updated_at
                author { # HurayUser node
                    userId
                    username
                    email
                }
                customFields {
                    key
                    label
                    type
                    value
                }
                attachments { # HurayAttachment node
                    attachmentId
                    filename
                    content_type
                    byte_size
                }
            }
        }
    }
}
```

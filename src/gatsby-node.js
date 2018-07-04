import crypto from 'crypto'

import HurayCmsClient from 'client'

exports.sourceNodes = async ({
    boundActionCreators: {
        createNode,
    },
    reporter,
    createNodeId,
}, {
    url,
    username,
    password,
}) => {
    const client = new HurayCmsClient(url)
    await client.login({ username, password })

    const users = await client.getAllUsers()
    const userNodes = users
    .map(user => {
        const contentDigest = crypto
            .createHash('md5')
            .update(JSON.stringify(user))
            .digest('hex')
        return {
            ...user,
            parent: 'root',
            children: [],
            id: createNodeId(`user_${user.id}`),
            userId: user.id,
            internal: {
                type: 'HurayUser',
                contentDigest,
            },
        }
    })
    userNodes.forEach(node => createNode(node))

    const contents = await client.getAllContents()
    const contentNodePromises = contents
    .map(async content => {
        const tags = content.tags || ['']
        const fields = await client.getFieldsForContent({ contentId: content.id })

        const attachments = await client.getAttachmentsForContent({ contentId: content.id })
        const attachmentNodes = attachments
        .map(attachment => {
            const contentDigest = crypto
                .createHash('md5')
                .update(JSON.stringify(content))
                .digest('hex')
            return {
                ...attachment,
                parent: 'root',
                children: [],
                id: createNodeId(`attachment_${attachment.id}`),
                attachmentId: attachment.id,
                internal: {
                    type: 'HurayAttachment',
                    mediaType: attachment.content_type,
                    contentDigest,
                },
            }
        })
        attachmentNodes.forEach(node => createNode(node))

        const contentDigest = crypto
            .createHash('md5')
            .update(JSON.stringify(content))
            .digest('hex')
        return {
            ...content,
            parent: 'root',
            children: [],
            id: createNodeId(`content_${content.id}`),
            customFields: fields,
            tags,
            contentId: content.id,
            author___NODE: userNodes
                .find(node => node.userId === content.author_id)
                .id,
            attachments___NODE: attachmentNodes.map(node => node.id),
            internal: {
                type: 'HurayContent',
                mediaType: 'text/markdown',
                contentDigest,
            },
        }
    })
    const contentNodes = await Promise.all(contentNodePromises)
    contentNodes.forEach(node => createNode(node))
} 

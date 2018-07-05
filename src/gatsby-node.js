import crypto from 'crypto'

import HurayCmsClient from 'client'

const buildGatsbyNode = ({ source, type, createNodeId }) => ({
    ...source,
    parent: 'root',
    children: [],
    id: createNodeId(`${type}_${source.id}`),
    [`${type}Id`]: source.id,
    internal: {
        type: `Huray${type[0].toUpperCase()}${type.slice(1)}`,
        contentDigest: crypto
            .createHash('md5')
            .update(JSON.stringify(source))
            .digest('hex'),

    },
})

exports.sourceNodes = async ({
    boundActionCreators: {
        createNode,
    },
    createNodeId,
}, {
    url,
    username,
    password,
}) => {
    const client = new HurayCmsClient(url)
    await client.login({ username, password })

    const users = await client.getAllUsers()
    const userNodes = users.map(source => buildGatsbyNode({
        type: 'user',
        source,
        createNodeId,
    }))
    userNodes.forEach(node => createNode(node))

    const contents = await client.getAllContents()
    const contentNodes = contents.map(source => buildGatsbyNode({
        type: 'content',
        source,
        createNodeId,
    }))
    contentNodes.forEach(node => node.internal.mediaType = 'text/markdown')
    contentNodes.forEach(node => {
        const authorNode = userNodes.find(userNode => node.author_id === userNode.userId)
        node.author___NODE = authorNode.id
        node.author_id = undefined
    })
    await Promise.all(
        contentNodes.map(async node => {
            const attachments = await client.getAttachmentsForContent({ contentId: node.contentId })
            const attachmentNodes = attachments.map(source => buildGatsbyNode({
                type: 'attachment',
                source,
                createNodeId,
            }))
            attachmentNodes.forEach(node => createNode(node))

            node.attachments___NODE = attachmentNodes.map(node => node.id)
        })
    )
    contentNodes.forEach(node => createNode(node))
} 

import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import nock from 'nock'

const url = 'http://localhost:3000'
const apiEndpoint = `${url}/api/v1`

axios.defaults.host = host
axios.defaults.adapter = httpAdapter

import gatsbySourcePlugin from 'gatsby-node'

describe('gatsby-source-huray-cms', () => {
    it('should build sourceNode correctly', async () => {
        const mockUser = {
            id: 1,
            username: 'user',
            password: 'password',
            email: 'user@example.com',
        }

        const mockContents = [
            {
                id: 1,
                title: 'My Content 1',
                description: 'My Content Description 1',
                published: true,
                created_at: '2018-06-26T04:51:36.825Z',
                updated_at: '2018-06-26T04:51:36.825Z',
                category: 'category1',
                tags: [
                    'tag1',
                ],
                author_id: mockUser.id,
            },
        ]

        nock(apiEndpoint)
            .post('/login', { 
                username: mockUser.username,
                password: mockUser.password, 
            })
            .reply(200, mockUser)

        nock(apiEndpoint)
            .get('/contents')
            .reply(200, mockContents)

        const mockGatsbyFn = {
            actions: {
                createNode: jest.fn(),
            },
            getNode: jest.fn(),
            createNodeId: jest.fn(),
        }

        gatsbySourcePlugin.sourceNodes(mockGatsbyFn, {
            url,
            username: mockUser.username,
            password: mockUser.password,
        })

        expect(mockGatsbyFn.actions.createNode).toHaveBeenCalledTimes(mockContents.length)
    })
})

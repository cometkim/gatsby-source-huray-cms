import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { readFileSync } from 'fs'

import gatsbySourcePlugin from 'gatsby-node'

import * as UserStub from './__fixtures__/user'
import * as ContentStub from './__fixtures__/content'
import * as CategoryStub from './__fixtures__/category'
import * as FieldStub from './__fixtures__/field'
import * as AttachmentStub from './__fixtures__/attachment'

const url = 'http://localhost:3000'

let mockApi = null

describe('gatsby-source-huray-cms', () => {
    beforeAll(() => {
        const { NO_MOCK_API } = process.env

        if (NO_MOCK_API === 'true') {
            return
        }

        mockApi = new MockAdapter(axios)

        mockApi
            .onPost('/users/login')
            .reply(200, UserStub.single, {
                TOKEN: 'JWT',
            })

        mockApi
            .onGet('/users')
            .reply(200, UserStub.many)

        mockApi
            .onGet(/^\/users\/(\d+|me)$/)
            .reply(200, UserStub.single)

        mockApi
            .onGet(/^\/users\/(\d+|me)\/contents$/)
            .reply(200, ContentStub.byAuthor(1))

        mockApi
            .onGet('/contents')
            .reply(200, ContentStub.many)

        mockApi
            .onGet(/^\/contents\/\d+$/)
            .reply(200, ContentStub.single)

        mockApi
            .onGet(/^\/contents\/\d+\/fields$/)
            .reply(200, FieldStub.many)

        mockApi
            .onGet(/^\/contents\/\d+\/attachments$/)
            .reply(200, AttachmentStub.many)

        mockApi
            .onGet(/^\/contents\/\d+\/attachments\/\d+$/)
            .reply(200, AttachmentStub.single)

            .onGet(/^\/contents\/\d+\/attachments\/\d+\/download$/)
            .reply(200,
                readFileSync(`${__dirname}/__fixtures__/test.png`).toString(),
                {
                    'Content-Type': 'image/png',
                    'Content-Disposition': 'attachment; filename="test.png"'
                },
            )

        mockApi
            .onGet('/categories')
            .reply(200, CategoryStub.keys)

        mockApi
            .onGet(/^\/categories\/[a-z]+$/)
            .reply(200, CategoryStub.single)

        mockApi
            .onGet(/^\/categories\/[a-z]+\/contents$/)
            .reply(200, ContentStub.inCategory('test'))
    })

    afterAll(() => {
        if (mockApi) {
            mockApi.restore()
        }
    })

    it('should build sourceNode correctly', async () => {
        const mockGatsbyOptions = {
            actions: {
                createNode: jest.fn(),
            },
            getNode: jest.fn(),
            createNodeId: jest.fn(),
        }

        await gatsbySourcePlugin.sourceNodes(mockGatsbyOptions, {
            url,
            username: 'admin',
            password: 'password',
        })

        // TODO: Assertions
    })
})

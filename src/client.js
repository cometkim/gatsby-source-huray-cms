import axios from 'axios'

export default class HurayCmsClient {
    static API_VERSION = '/api/v1'

    constructor(baseUrl) {
        this.client = axios.create({
            baseURL: `${baseUrl}${HurayCmsClient.API_VERSION}`
        })
    }

    login = async ({ username, password }) => {
        try {
            const res = await this.client.post(`/users/login`, { username, password }) 
            this.client.defaults.headers.common['Authorization'] = res.headers.token
        } catch(error) {
            this._onError(error)
        }
    }

    // Users
    getAllUser = async () => await this._fetch(
        `/users`
    )
    getUser = async ({ userId }) => await this._fetch(
        `/users/${userId}`
    )

    // Contents
    getAllContents = async () => await this._fetch(
        `/contents`
    )
    getContent = async ({ contentId }) => await this._fetch(
        `/contents/${contentId}`
    )
    getFieldsForContents = async ({ contentId }) => await this._fetch(
        `/contents/${contentId}/fields`
    )
    getAttachmentsForContents = async ({ contentId }) => await this._fetch(
        `/contents/${contentId}/attachments`
    )
    getAttachment = async ({ contentId, attachmentId }) => await this._fetch(
        `/contents/${contentId}/attachments/${attachmentId}`
    )
    downloadAttachment = async ({ contentId, attachmentId }) => await this._fetch(
        `/contents/${contentId}/attachments/${attachmentId}/download`
    )
    getContentsByCategory = async ({ categoryKey }) => await this._fetch(
        `/categories/${categoryKey}/contents`
    )

    // Categories
    getAllCategories = async () => await this._fetch(
        `/categories`
    )
    getCategory = async ({ categoryKey }) => await this._fetch(
        `/categories/${categoryKey}`
    )

    _fetch = async (uri) => {
        try {
            const { data } = await this.client.get(uri)
            return data
        } catch (error) {
            this._onError(error)
        }
        return null
    }

    _onError = (error) => {
        console.error(error)
    }
}

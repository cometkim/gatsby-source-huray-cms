import axois from 'axios'

export default class HurayCmsClient {
    static API_VERSION = '/api/v1'

    constructor(baseUrl) {
        this.baseUrl = baseUrl
        this.apiEndpoint = baseUrl + HurayCmsClient.API_VERSION
        this.token = null
    }

    login = async ({ username, password }) => {
        const res = await axois.post(`${this.getUsersRoute()}/login`, { username, password }) 
        this.token = res.headers['TOKEN']
    }

    // Users
    getAllUser = async () => await this._fetch(
        `${this.apiEndpoint}/users`
    )
    getUser = async ({ userId }) => await this._fetch(
        `${this.apiEndpoint}/users/${userId}`
    )

    // Contents
    getAllContents = async () => await this._fetch(
        `${this.apiEndpoint}/contents`
    )
    getContent = async ({ contentId }) => await this._fetch(
        `${this.apiEndpoint}/contents/${contentId}`
    )
    getFieldsForContents = async ({ contentId }) => await this._fetch(
        `${this.apiEndpoint}/contents/${contentId}/fields`
    )
    getAttachmentsForContents = async ({ contentId }) => await this._fetch(
        `${this.apiEndpoint}/contents/${contentId}/attachments`
    )
    getContentsByCategory = async ({ categoryKey }) => await this._fetch(
        `${this.apiEndpoint}/categories/${categoryKey}/contents`
    )

    // Categories
    getAllCategories = async () => await this._fetch(
        `${this.apiEndpoint}/categories`
    )
    getCategory = async ({ categoryKey }) => await this._fetch(
        `${this.apiEndpoint}/categories/${categoryKey}`
    )

    // Assets
    getAllAssets = async () => await this._fetch(
        `${this.apiEndpoint}/assets`
    )
    getAsset = async ({ assetId }) => await this._fetch(
        `${this.apiEndpoint}/assets/${assetId}`
    )

    _fetch = async (url) => {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })
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

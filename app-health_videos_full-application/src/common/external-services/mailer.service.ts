import axios from 'axios'
import pino from 'pino'

export class MailerService {
  private readonly logger = pino()

  constructor() {}

  async sendEmail(recipientEmail: string, name: string, token: number) {
    const api = this.axiosInstance()
    try {
      this.logger.info('Sending email...')
      const data = {
        email: recipientEmail,
        origin: 'MOVE_FORGOT_PASSWORD',
        content: {
          fullName: name,
          token
        }
      }
      const response = await api.post('', data)
      this.logger.info('Email sent successfully')
      return response
    } catch (error) {
      this.logger.error(error)
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data)
      }
      throw new Error(error)
    }
  }

  private axiosInstance() {
    const baseUrl = process.env.TOKEN_SENDER_SERVICE_URL
    const api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      baseURL: baseUrl
    })

    return api
  }
}

import { AxiosHttpClientAdapter } from '@/services/axios/AxiosHttpClientAdapter'
import * as Errors from '@services/axios/errors'
import { listDigitalCertificatesService } from '@/services/digital-certificates-services'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { localeMock } from '@/tests/utils/localeMock'

const fixtures = {
  domainMock: {
    id: 1,
    name: 'Certificate 1',
    issuer: 'Issuer 1',
    subject_name: ['Subject 1', 'Subject 2'],
    certificate_type: 'edge_certificate',
    validity: new Date(2023, 10, 10),
    status: 'active'
  },
  domainWithMissedValuesMock: {
    id: 2,
    name: 'Certificate 2',
    subject_name: [],
    certificate_type: null,
    validity: null,
    status: 'active'
  }
}

const makeSut = () => {
  const sut = listDigitalCertificatesService

  return {
    sut
  }
}

describe('DigitalCertificatesServices', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call api with correct params', async () => {
    const requestSpy = vi.spyOn(AxiosHttpClientAdapter, 'request').mockResolvedValueOnce({
      statusCode: 200,
      body: []
    })
    const { sut } = makeSut()

    await sut({})

    expect(requestSpy).toHaveBeenCalledWith({
      url: `digital_certificates?order_by=name&sort=asc&page=1&page_size=200`,
      method: 'GET'
    })
  })

  it('should parse correctly each returned item', async () => {
    localeMock()
    vi.setSystemTime(new Date(2023, 10, 10, 10))
    vi.spyOn(AxiosHttpClientAdapter, 'request').mockResolvedValueOnce({
      statusCode: 200,
      body: { results: [fixtures.domainMock, fixtures.domainWithMissedValuesMock] }
    })
    const { sut } = makeSut()

    const result = await sut({})
    const [parsedDomain, parsedDomainMissingValues] = result

    expect(parsedDomain).toEqual({
      id: fixtures.domainMock.id,
      name: fixtures.domainMock.name,
      issuer: fixtures.domainMock.issuer,
      type: 'Edge Certificate',
      subjectName: 'Subject 1,Subject 2',
      validity: 'Friday, November 10, 2023 at 12:00 AM',
      status: fixtures.domainMock.status
    })
    expect(parsedDomainMissingValues).toEqual({
      id: 2,
      issuer: '-',
      name: 'Certificate 2',
      status: 'active',
      subjectName: '-',
      type: '-',
      validity: '-'
    })
  })

  it.each([
    {
      statusCode: 400,
      expectedError: new Errors.InvalidApiRequestError().message
    },
    {
      statusCode: 401,
      expectedError: new Errors.InvalidApiTokenError().message
    },
    {
      statusCode: 403,
      expectedError: new Errors.PermissionError().message
    },
    {
      statusCode: 404,
      expectedError: new Errors.NotFoundError().message
    },
    {
      statusCode: 500,
      expectedError: new Errors.InternalServerError().message
    },
    {
      statusCode: 'unmappedStatusCode',
      expectedError: new Errors.UnexpectedError().message
    }
  ])(
    'should throw when request fails with statusCode $statusCode',
    async ({ statusCode, expectedError }) => {
      vi.spyOn(AxiosHttpClientAdapter, 'request').mockResolvedValueOnce({
        statusCode,
        body: { results: [] }
      })
      const { sut } = makeSut()

      const response = sut({})

      expect(response).rejects.toBe(expectedError)
    }
  )
})

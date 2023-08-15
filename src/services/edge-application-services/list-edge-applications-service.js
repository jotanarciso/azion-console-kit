import { AxiosHttpClientAdapter, parseHttpResponse } from "../axios/AxiosHttpClientAdapter";

export const listEdgeApplicationsService = async ({ page }) => {
  let httpResponse = await AxiosHttpClientAdapter
    .request({
      url: `edge_applications?page=${page}`,
      method: 'GET',
    })

  // httpResponse = {
  //   body: {
  //     results: [
  //       {
  //         id: '123321',
  //         name: 'Edge App 1',
  //         last_editor: 'john@doe.com',
  //         last_modified: 'April 7,2023,4:36p.m',
  //         origins: 'Default, X Origin',
  //         active: true
  //       },
  //       {
  //         id: '2232323098',
  //         name: 'Edge App 33',
  //         last_editor: 'Jane@doe.com',
  //         last_modified: 'April 2,2023,4:36p.m',
  //         origins: 'X Origin',
  //         active: false
  //       }
  //     ],
  //   },
  //   statusCode: 200,
  // }

  return parseHttpResponse(httpResponse).results
}
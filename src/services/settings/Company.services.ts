import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { Company } from "../../types/settings/Company.types";
import HttpService from "../common/HttpService";

class CompanyService {
  static async getAll(): Promise<CustomResponse<Company[]>> {
    return HttpService.callApi(API_ENDPOINTS.COMPANY.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Company>> {
    return HttpService.callApi(API_ENDPOINTS.COMPANY.GET_BY_ID(id), "GET");
  }

  static async create(data: Company): Promise<CustomResponse<Company>> {
    return HttpService.callApi(API_ENDPOINTS.COMPANY.CREATE, "POST", data);
  }

  static async update(id: number, data: Company): Promise<CustomResponse<Company>> {
    return HttpService.callApi(API_ENDPOINTS.COMPANY.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.COMPANY.DELETE(id), "DELETE");
  }
}

export default CompanyService;

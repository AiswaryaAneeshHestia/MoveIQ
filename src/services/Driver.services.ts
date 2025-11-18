//DriverService.ts
import type { Driver } from "../types/Driver.types";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";
import type { CustomResponse } from "../types/common/ApiTypes";
import HttpService from "./common/HttpService";

class DriverService {
  static async getAll(): Promise<CustomResponse<Driver[]>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.GET_BY_ID(id), "GET");
  }

  static async create(data: Driver): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.CREATE, "POST", data);
  }
  
  static async update(id: number, data: Driver): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.DELETE(id), "DELETE");
  }

   //New: Upload driver profile picture
  static async uploadProfilePic(driverId: number, file: File): Promise<CustomResponse<string>> {
    const formData = new FormData();
    formData.append("id", driverId.toString());
    formData.append("file", file);

    return HttpService.callApi(
      API_ENDPOINTS.DRIVER.UPLOAD_PROFILE_PIC,
      "POST",
      formData,
      false,
      true // <- this marks the call as FormData
    );
  }
}

export default DriverService;

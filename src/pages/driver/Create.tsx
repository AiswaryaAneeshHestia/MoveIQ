import React,{useState} from "react";
import {Form,Button,Container,Row,Col,Image,OverlayTrigger,Tooltip} from "react-bootstrap";
import {FaArrowLeft,FaPen} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";
import type {Driver} from "../../types/Driver.types";
import DriverService from "../../services/Driver.services";
import {KiduValidation} from "../../components/KiduValidation";

const DriverCreate:React.FC=()=>{
 const navigate=useNavigate();

 const fields=[
  {name:"driverName",label:"Driver Name",rules:{required:true,type:"text"}},
  {name:"dob",label:"Date of Birth",rules:{required:true,type:"date"}},
  {name:"contactNumber",label:"Phone Number",rules:{required:true,type:"number",minLength:10,maxLength:10}},
  {name:"nationality",label:"Nationality",rules:{required:true,type:"text"}},
  {name:"license",label:"License Number",rules:{required:true,type:"text",minLength:5}},
  {name:"nationalId",label:"IQAMA Number",rules:{required:true,type:"text",minLength:5}}
 ];

 const initialValues:any={photo:null,imageSrc:""};
 const initialErrors:any={};
 fields.forEach(f=>{initialValues[f.name]="";initialErrors[f.name]=""});

 const [formData,setFormData]=useState(initialValues);
 const [errors,setErrors]=useState(initialErrors);
 const [imagePreview,setImagePreview]=useState<string|null>(null);

 const handleChange=(e:any)=>{
  const{name,value,type,files}=e.target;
  if(type==="file"&&files&&files.length>0){
   const file=files[0];
   setFormData((prev:any)=>({...prev,photo:file}));
   if(imagePreview)URL.revokeObjectURL(imagePreview);
   setImagePreview(URL.createObjectURL(file));
   return;
  }
  const updated=type==="tel"?value.replace(/[^0-9]/g,""):value;
  setFormData((prev:any)=>({...prev,[name]:updated}));
  if(errors[name])setErrors((prev:any)=>({...prev,[name]:""}));
 };

 const validateField=(name:string,value:any)=>{
  const rule=fields.find(f=>f.name===name)?.rules;
  if(!rule)return true;
  const result=KiduValidation.validate(value,rule as any);
  setErrors((prev:any)=>({...prev,[name]:result.isValid?"":result.message}));
  return result.isValid;
 };

 const validateForm=()=>{
  let ok=true;
  fields.forEach(f=>{if(!validateField(f.name,formData[f.name]))ok=false});
  return ok;
 };

 const handleSubmit=async(e:any)=>{
  e.preventDefault();
  if(!validateForm())return;
  try{
   const driverData:Driver={
    driverId:0,
    driverName:formData.driverName,
    license:formData.license,
    nationality:formData.nationality,
    contactNumber:formData.contactNumber,
    dob:formData.dob,
    dobString:formData.dob,
    nationalId:formData.nationalId,
    isRented:false,
    isActive:true,
    auditLogs:[],
    imageSrc:"",
    gender:""
   };
   const response=await DriverService.create(driverData);
   if(response.isSucess){
    toast.success("Driver added successfully!");
    setTimeout(()=>navigate("/admin-dashboard/drivers"),2000);
   }else toast.error(response.customMessage||"Failed to add driver");
  }catch(err:any){toast.error(err.message)}
 };

 const handleReset=()=>{
  setFormData(initialValues);
  setErrors(initialErrors);
  if(imagePreview)URL.revokeObjectURL(imagePreview);
  setImagePreview(null);
 };

 return(
  <>
   <Container className="px-4 mt-5 shadow-sm rounded" style={{backgroundColor:"white",fontFamily:"Urbanist"}}>
    <div className="d-flex align-items-center mb-3">
     <Button size="sm" variant="link" className="me-2 mt-3 text-white" style={{backgroundColor:"#18575A",padding:"0.2rem 0.5rem"}} onClick={()=>navigate(-1)}><FaArrowLeft/></Button>
     <h4 className="fw-bold mb-0 mt-3" style={{color:"#18575A"}}>Add New Driver</h4>
    </div>
    <hr/>

    <Form onSubmit={handleSubmit} className="p-4">
     <Row>
      <Col xs={12} md={4} className="d-flex flex-column align-items-center mb-4">
       <div style={{position:"relative",width:"160px",height:"160px"}}>
        <Image src={imagePreview||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWzfZX4ha78BX5OP6gm6PA_Q91tW9jC7KVTg&s"} roundedCircle width={160} height={160} style={{objectFit:"cover",border:"1px solid #ccc"}}/>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Upload Photo</Tooltip>}>
         <label htmlFor="photoUpload" style={{position:"absolute",bottom:"5px",right:"5px",background:"#18575A",borderRadius:"50%",padding:"8px 11px",cursor:"pointer"}}><FaPen style={{color:"#fff",fontSize:"14px"}}/></label>
        </OverlayTrigger>
        <Form.Control type="file" id="photoUpload" name="photo" onChange={handleChange} accept="image/*" style={{display:"none"}}/>
       </div>
      </Col>

      <Col xs={12} md={8}>
       <Row>
        {fields.map(f=>(
         <Col md={6} className="mb-3" key={f.name}>
          <Form.Label className="fw-semibold">{f.label}</Form.Label>
          <Form.Control type={f.rules.type==="number"?"tel":f.rules.type} name={f.name} value={formData[f.name]} placeholder={`Enter ${f.label.toLowerCase()}`} onChange={handleChange} onBlur={()=>validateField(f.name,formData[f.name])}/>
          {errors[f.name]&&<small className="text-danger">{errors[f.name]}</small>}
         </Col>
        ))}
       </Row>
      </Col>
     </Row>

     <Row className="mb-3"><Col xs={12}><div className="alert alert-info"><strong>Note:</strong> You can upload attachments later after creating this driver.</div></Col></Row>

     <div className="d-flex gap-2 justify-content-end mt-4">
      <Button type="button" variant="outline-secondary" onClick={handleReset}>Reset</Button>
      <Button type="submit" style={{backgroundColor:"#18575A",border:"none"}}>Submit</Button>
     </div>
    </Form>
   </Container>
   <Toaster position="top-right"/>
  </>
 );
};
export default DriverCreate;

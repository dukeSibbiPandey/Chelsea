using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.Model;

namespace ChelseaApp
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Submittal, SubmittalModel>();
            CreateMap<SubmittalList, SubmittalModel>();
            CreateMap<AddressMaster, AddressModel>();
            CreateMap<AddressMasterList, AddressModel>();
            CreateMap<CityMaster, CityModel>();
            CreateMap<StateMaster, StateModel>();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chelsea.Repository
{
    public class AddressMaster
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string Name { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class AddressMasterList
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string Name { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public bool IsPrimary { get; set; }
    }
}

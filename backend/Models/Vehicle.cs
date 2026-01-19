using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostgresAPI.Models
{
    public class Vehicle
{
    [Column("aracid")]
    public int aracId { get; set; }

    [Column("aracplaka")]
    public string aracPlaka { get; set; }

    [Column("veritarihi")]
    public DateOnly veriTarihi { get; set; }

    [Column("hiz")]
    public float hiz { get; set; }

    [Column("kmsayaci")]
    public float kmSayaci { get; set; }
}

}

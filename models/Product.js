const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        user_uid:                    { type: String, required:true },
        user_name:                   { type: String },
        icerik_adi:                  { type: String },
        aciklama:                    { type: String },
        normal_fiyat:                { type: String },
        indirimli_fiyat:             { type: String },
        maliyet:                     { type: String },
        vergi:                       { type: String },
        foto_url:                    { type: Array }, 
        foto_thumbUrl:               { type: Array }, 
        paylasim_tarihi:             { type: Number },
        oncelik:                     { type: String },
        kategoriler:                 { type: Array },
        durum:                       { type: String, default:"Hazırlanıyor" },
        tasarimci_notu:              { type: String },
        tasarim_url:                 {
            img:     { type: Array },
            secilen: { type: Array },
            secildi: { type: Boolean }
        },
        tasarim_thumbUrl:            {
            img:     { type: Array },
            secilen: { type: Array },
            secildi: { type: Boolean }
        },
        musteri_sectikleri_url:      { type: Array },
        musteri_sectikleri_thumbUrl: { type: Array },
        tasarim_onay:                { type: String },
        link_baglanti:               { type: String },
        bildirim_musteri:            { type: String },
        bildirim_tasarim:            { type: String },
    },
    { timestamps:true }
)

module.exports = mongoose.model("Product", ProductSchema)
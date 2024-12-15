class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };
      const removeFields = ['keyword', 'page', 'limit', 'sort'];

      removeFields.forEach((field) => delete queryCopy[field]);

      if (queryCopy.catagory && (queryCopy.subcatagory==="")) {
        this.query = this.query.find({ catagory: queryCopy.catagory });
        delete queryCopy.catagory;
        delete queryCopy.subcatagory;
    }
    if (queryCopy.catagory && queryCopy.subcatagory) {
      this.query = this.query.find({ subCatagory: queryCopy.subcatagory });
      delete queryCopy.catagory;
      delete queryCopy.subcatagory;
  }

      if (queryCopy.brand && !queryCopy.subcatagory) {
          this.query = this.query.find({ brand: queryCopy.brand });
          delete queryCopy.brand;
      }

      if (!queryCopy.brand && queryCopy.subcatagory) {
          this.query = this.query.find({ subCatagory: queryCopy.subcatagory });
          delete queryCopy.subcatagory;
      }

      // If both brand and subcategory are present, we prioritize brand
      if (queryCopy.brand && queryCopy.subcatagory) {
          this.query = this.query.find({ brand: queryCopy.brand });
          delete queryCopy.brand;
          delete queryCopy.subcatagory;
      }

      this.query = this.query.find(queryCopy);
      return this;
  }
  
    pagination(resultPerPage) {
      const currentPage = parseInt(this.queryStr.page, 10) || 1;
      const limit = parseInt(this.queryStr.limit, 10) || resultPerPage;
      const skip = (currentPage - 1) * limit;
  
      this.query = this.query.limit(limit).skip(skip);
      return this;
    }
  
    sort() {
      if (this.queryStr.sort === 'priceLowToHigh') {
        this.query = this.query.sort('price');
      } else if (this.queryStr.sort === 'priceHighToLow') {
        this.query = this.query.sort('-price');
      } else {
        // Default sorting if no sort parameter is provided
        this.query = this.query.sort('createdAt');
      }
      return this;
    }
  }
  
  module.exports = ApiFeatures;
  
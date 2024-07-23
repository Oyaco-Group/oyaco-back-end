const { generateResiNumber, sendEmailToBuyer } = require("../lib/nodeMailer");
const prisma = require("../lib/prisma");
const { updateOrderStatus } = require("../lib/statusUpdater");

class OrderService2 {
    static async createOrder(params) {
        const {user_id, payment_type, order_status, buyer_status, products} = params;

        const order = await prisma.order.create({
            data : {
                user_id : +user_id,
                payment_type,
                order_status,
                buyer_status
            },
            include : {
                user : {
                    select : {
                        id : true,
                        name : true,
                        email : true,
                        address : true
                    }
                }
            }
        })

        const createOrderItem = async() => {
            for(const product of products) {
                product.order_id = order.id;
                const inventory = await prisma.inventory.findUnique({
                    where : {id : +product.inventory_id}
                })
                const quantityInventory = inventory.quantity;
                if(product.quantity > quantityInventory) {
                    throw({name : "invalidInput", message : "Product quantity is not Enough"})
                }
                await prisma.order_item.create({
                    data : {...product}
                })
                const quantityDifference = quantityInventory - product.quantity;
                await prisma.inventory.update({
                    where : {id : +product.inventory_id},
                    data : {
                        quantity : quantityDifference
                    }
                })
            }
        }
        await createOrderItem();
        
        const complaint = await prisma.complaint.create({
            data : {
                order_id : order.id,
                iscomplaint : false
            }
        })

        return order;
    }

    static async updateOrder(params) {
        const {id,user_id, payment_type, order_status, buyer_status, products} = params;
        const existingOrder = await prisma.order.findUnique({
            where : {id : +id}
        })
        if(!existingOrder) throw({name : 'failedToUpdate', message : 'Can not Find Order'})

        const order = await prisma.order.update({
            where : {id : +id},
            data : {
                user_id,payment_type,order_status,buyer_status
            }, 
            include : {
                order_item : {
                    select : {
                        id : true
                    }
                }
            }
        })

        let productsInput = [];

        products.map((product) => {
            product.order_id = +id;
            productsInput.push(product);
        })
       
        if(productsInput.length > order.order_item.length) {
            for(const i in productsInput) {
                if(i < order.order_item.length) {
                    await prisma.order_item.update({
                        where : {
                            id : order.order_item[i].id
                        },
                        data : {
                            master_product_id : productsInput[i].master_product_id,
                            quantity : productsInput[i].quantity,
                            inventory_id : productsInput[i].inventory_id || null
                        }
                    })
                } else {
                    await prisma.order_item.create({
                        data : {
                            order_id : order.id,
                            master_product_id : productsInput[i].master_product_id,
                            quantity : productsInput[i].quantity,
                            inventory_id : productsInput[i].inventory_id || null
                        }
                    })
                }
            }
        }

        if(productsInput.length < order.order_item.length) {
            for(const i in order.order_item) {
                if(i < productsInput.length) {
                    await prisma.order_item.update({
                        where : {
                            id : order.order_item[i].id
                        },
                        data : {
                            master_product_id : productsInput[i].master_product_id,
                            quantity : productsInput[i].quantity,
                            inventory_id : productsInput[i].inventory_id || null
                        }
                    })
                } else {
                    await prisma.order_item.delete({
                        where : {
                            id : order.order_item[i].id
                        }
                    })
                }
            }
        }

        if(productsInput.length === order.order_item.length) {
            
            for(const i in productsInput) {
                await prisma.order_item.update({
                    where : {
                        id : order.order_item[i].id
                    },
                    data : {
                        master_product_id : productsInput[i].master_product_id,
                        quantity : productsInput[i].quantity,
                        inventory_id : productsInput[i].inventory_id || null
                    }
                })
            }
        }

        return order;
    }

    static async sendOrder(params) {
        const {id,user_id} = params;

        const order = await prisma.order.findUnique({
            where : {id : +id}
        })
        const user = await prisma.user.findUnique({
            where : {id : +user_id}
        })
        const email = user.email;

        const resiNumber = generateResiNumber(order);
        const emailInfo = sendEmailToBuyer(email, resiNumber);

        async function getData(emailInfo) {
            try {
              let result = await emailInfo;
              return result;
            } catch (error) {
              console.log(error);
            }
          }

          const infoMessageId = await getData(emailInfo);

          const scheduledTime = new Date().getTime() + 6*1000; // 1 menit setelah pembuatan order
      
          const delay = scheduledTime - new Date();
          setTimeout(async () => {
            console.log("Running order status update job...");
            await updateOrderStatus(order.id);
          }, delay);
      
          return {resi: resiNumber, info: infoMessageId };
          
    }

    static async updateOrderStatus(data) {
        const { id, order_status } = data;
    
        const existOrder = await prisma.order.findUnique({
          where: { id: parseInt(id) },
        });
    
        if (!existOrder) {
          throw { name: "failedToUpdate", message: "Order not found" };
        }
    
        const order = await prisma.order.update({
          where: { id: parseInt(id) },
          data: {
            order_status: order_status,
          },
        });
    
        return order;
      }
}


module.exports = OrderService2;